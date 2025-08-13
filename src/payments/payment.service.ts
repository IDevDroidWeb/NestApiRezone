import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { IPayment } from './interfaces/payment.interface';
import { Payment } from './schemas/payment.schema';
import {
  MyFatoorahPaymentResponse,
  MyFatoorahPaymentStatusResponse
} from './interfaces/myfatoorah-response.interface';
import AppConfig from "../config/configuration";

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<IPayment>,
    private configService: ConfigService<typeof AppConfig>,
    private httpService: HttpService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<IPayment> {
    const createdPayment = new this.paymentModel(createPaymentDto);
    return createdPayment.save();
  }

  async findAll(): Promise<IPayment[]> {
    return this.paymentModel.find().exec();
  }

  async findOne(id: string): Promise<IPayment | null> {
    return this.paymentModel.findById(id).exec();
  }

  async initiatePayment(paymentId: string): Promise<any> {
    const payment = await this.paymentModel.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Get config values with proper typing
    const myfatoorahApiKey = this.configService.get('myfatoorah.apiKey', { infer: true });
    const myfatoorahBaseUrl = this.configService.get('myfatoorah.baseUrl', { infer: true });
    const appBaseUrl = this.configService.get('app.baseUrl');

    const paymentData = {
      InvoiceAmount: payment.amount,
      CurrencyIso: payment.currency,
      CustomerName: payment.customerName,
      CustomerEmail: payment.customerEmail,
      DisplayCurrencyIso: payment.currency,
      CallBackUrl: `${appBaseUrl}/payments/callback`,
      ErrorUrl: `${appBaseUrl}/payments/error`,
      Language: 'en',
      CustomerReference: paymentId,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<MyFatoorahPaymentResponse>(
          `${myfatoorahBaseUrl}/v2/ExecutePayment`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${myfatoorahApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      payment.paymentUrl = data.Data.PaymentURL;
      payment.referenceId = data.Data.InvoiceId;
      await payment.save();

      return {
        paymentUrl: data.Data.PaymentURL,
        invoiceId: data.Data.InvoiceId,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('MyFatoorah error:', error.message);
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const axiosError = error as { response?: { data?: unknown } };
          console.error('Response data:', axiosError.response?.data);
        }
      }
      throw new Error('Payment initiation failed');
    }
  }

  async handlePaymentCallback(referenceId: string): Promise<IPayment> {
    const payment = await this.paymentModel.findOne({ referenceId });
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Get config values with proper typing
    const myfatoorahApiKey = this.configService.get('myfatoorah.apiKey', { infer: true });
    const myfatoorahBaseUrl = this.configService.get('myfatoorah.baseUrl', { infer: true });

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<MyFatoorahPaymentStatusResponse>(
          `${myfatoorahBaseUrl}/v2/GetPaymentStatus`,
          {
            params: { Key: referenceId },
            headers: {
              Authorization: `Bearer ${myfatoorahApiKey}`,
            },
          },
        ),
      );

      const paymentStatus = data.Data.InvoiceStatus;
      payment.status = paymentStatus.toLowerCase();
      payment.transactionId = data.Data.InvoiceTransactions?.[0]?.TransactionId;

      return payment.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('MyFatoorah error:', error.message);
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const axiosError = error as { response?: { data?: unknown } };
          console.error('Response data:', axiosError.response?.data);
        }
      }
      throw new Error('Payment initiation failed');
    }
  }
}