import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  currency!: string;

  @Prop({ required: true })
  customerName!: string;

  @Prop({ required: true })
  customerEmail!: string;

  @Prop({ required: true })
  paymentMethod!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: 'pending' })
  status!: string;

  @Prop()
  transactionId?: string;

  @Prop()
  paymentUrl!: string;

  @Prop()
  referenceId!: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);