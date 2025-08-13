import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Payment successfully created' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'List of all payments' })
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details' })
  async findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post(':id/initiate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment with MyFatoorah' })
  @ApiResponse({
    status: 200,
    description: 'Payment URL for redirection',
  })
  async initiatePayment(@Param('id') id: string) {
    return this.paymentService.initiatePayment(id);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Handle payment callback' })
  @ApiResponse({ status: 200, description: 'Payment status updated' })
  async handleCallback(@Query('paymentId') paymentId: string) {
    return this.paymentService.handlePaymentCallback(paymentId);
  }
}