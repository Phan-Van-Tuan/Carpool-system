import { Types } from "mongoose";
import _Trip from "../../models/trip.model";
import _Booking, { EBookingStatus } from "../../models/booking.model";
import _Transaction, {
  ETranferStatus,
  ETransactionMethod,
  ETransactionType,
} from "../../models/transaction.model";

export async function finishBooking(bookingId: string) {
  const bookingObjectId = new Types.ObjectId(bookingId);

  const booking = await _Booking.findById(bookingObjectId);
  if (!booking) throw new Error("Booking not found");

  if (booking.status === "finished") return booking; // đã xử lý

  if (booking.paymentMethod === ETransactionMethod.CASH) {
    await _Transaction.create({
      bookingId: booking._id,
      amount: booking.price,
      customerId: booking.customerId,
      method: ETransactionMethod.CASH,
      type: ETransactionType.RIDER,
    });

    booking.status = EBookingStatus.FINISHED;
    booking.paymentStatus = ETranferStatus.SUCCESS;
  } else if (
    booking.paymentMethod === "momo" ||
    booking.paymentMethod === "vnpay"
  ) {
    if (booking.paymentStatus === "success") {
      booking.status = EBookingStatus.FINISHED;
    } else {
      booking.status = EBookingStatus.ENDING;
    }
  }

  await booking.save();
  return booking;
}
