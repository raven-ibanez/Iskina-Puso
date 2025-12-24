import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

import { useSiteSettings } from '../hooks/useSiteSettings';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  initialRoomNumber?: string;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack, initialRoomNumber = '' }) => {
  const { paymentMethods } = usePaymentMethods();
  const { siteSettings } = useSiteSettings();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('room-service');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  // const [referenceNumber, setReferenceNumber] = useState(''); // Removed unused state
  const [roomNumber, setRoomNumber] = useState(initialRoomNumber);
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    // Check store availability
    if (siteSettings) {
      if (siteSettings.is_temporarily_closed) {
        alert('Sorry, the store is currently temporarily closed. Please try again later.');
        return;
      }

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const [openHour, openMinute] = siteSettings.opening_time.split(':').map(Number);
      const [closeHour, closeMinute] = siteSettings.closing_time.split(':').map(Number);

      const openTime = openHour * 60 + openMinute;
      const closeTime = closeHour * 60 + closeMinute;

      // Handle overnight hours (e.g. 10 PM to 2 AM)
      let isOpen = false;
      if (closeTime < openTime) {
        isOpen = currentTime >= openTime || currentTime <= closeTime;
      } else {
        isOpen = currentTime >= openTime && currentTime <= closeTime;
      }

      if (!isOpen) {
        const formatTime = (time: string) => {
          const [h, m] = time.split(':');
          return new Date(2000, 0, 1, +h, +m).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        };

        alert(`Sorry, the store is currently closed. Operating hours are from ${formatTime(siteSettings.opening_time)} to ${formatTime(siteSettings.closing_time)}.`);
        return;
      }
    }

    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`);

    const orderDetails = `
🛒 Iskina Puso ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
${roomNumber ? `🏨 Room: ${roomNumber}` : ''}
📍 Service: ${serviceType === 'room-service' ? 'Room Service' : 'Pickup'}
⏰ Service Time: ${timeInfo}


📋 ORDER DETAILS:
${cartItems.map(item => {
      let itemDetails = `• ${item.name}`;
      if (item.selectedVariation) {
        itemDetails += ` (${item.selectedVariation.name})`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} x${addOn.quantity}`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
      return itemDetails;
    }).join('\n')}

💰 TOTAL: ₱${totalPrice}


💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing Iskina Puso! 
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/IskinaPuso?text=${encodedMessage}`;

    window.open(messengerUrl, '_blank');
  };

  const isDetailsValid = customerName && contactNumber && roomNumber &&
    (pickupTime !== 'custom' || customTime);

  // Show loading state if settings aren't loaded yet
  if (!siteSettings) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-iskina-green"></div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-noto font-semibold text-black ml-8">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-noto font-medium text-black mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-iskina-green/10">
                  <div>
                    <h4 className="font-medium text-black">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-gray-600">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Add-ons: {item.selectedAddOns.map(addOn =>
                          addOn.quantity && addOn.quantity > 1
                            ? `${addOn.name} x${addOn.quantity}`
                            : addOn.name
                        ).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-black">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-iskina-green/20 pt-4">
              <div className="flex items-center justify-between text-2xl font-noto font-semibold text-black">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-noto font-medium text-black mb-6">Customer Information</h2>

            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent transition-all duration-200"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Room Number *</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent transition-all duration-200"
                  placeholder="Enter room number"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-black mb-3">Service Type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'pickup', label: 'Pickup', icon: '🚶' },
                    { value: 'room-service', label: 'Room Service', icon: '🛎️' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${serviceType === option.value
                        ? 'border-iskina-green bg-iskina-green text-white'
                        : 'border-iskina-green/30 bg-white text-gray-700 hover:border-iskina-green'
                        }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Time Selection */}
              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  {serviceType === 'room-service' ? 'Preferred Service Time *' : 'Pickup Time *'}
                </label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '5-10', label: '5-10 minutes' },
                      { value: '15-20', label: '15-20 minutes' },
                      { value: '25-30', label: '25-30 minutes' },
                      { value: 'custom', label: 'Custom Time' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPickupTime(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${pickupTime === option.value
                          ? 'border-iskina-green bg-iskina-green text-white'
                          : 'border-iskina-green/30 bg-white text-gray-700 hover:border-iskina-green'
                          }`}
                      >
                        <Clock className="h-4 w-4 mx-auto mb-1" />
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {pickupTime === 'custom' && (
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent transition-all duration-200"
                      placeholder={serviceType === 'room-service' ? "e.g., 8:00 AM, In 45 mins" : "e.g., 45 minutes, 1 hour, 2:30 PM"}
                      required
                    />
                  )}
                </div>
              </div>



              {/* Special Notes */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-iskina-green/30 rounded-lg focus:ring-2 focus:ring-iskina-green focus:border-transparent transition-all duration-200"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 transform ${isDetailsValid
                  ? 'bg-iskina-green text-white hover:bg-iskina-dark hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Details</span>
        </button>
        <h1 className="text-3xl font-noto font-semibold text-black ml-8">Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-noto font-medium text-black mb-6">Choose Payment Method</h2>

          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${paymentMethod === method.id
                  ? 'border-iskina-green bg-iskina-green text-white'
                  : 'border-iskina-green/30 bg-white text-gray-700 hover:border-iskina-green'
                  }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-iskina-green/5 rounded-lg p-6 mb-6 border border-iskina-green/20">
              <h3 className="font-medium text-black mb-4">Payment Details</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-black font-medium">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm text-gray-600 mb-3">Account Name: {selectedPaymentMethod.account_name}</p>
                  <p className="text-xl font-semibold text-black">Amount: ₱{totalPrice}</p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={selectedPaymentMethod.qr_code_url}
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-32 h-32 rounded-lg border-2 border-iskina-green/30 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">Scan to pay</p>
                </div>
              </div>
            </div>
          )}

          {/* Reference Number */}
          <div className="bg-iskina-gold/10 border border-iskina-gold/30 rounded-lg p-4">
            <h4 className="font-medium text-black mb-2">📸 Payment Proof Required</h4>
            <p className="text-sm text-gray-700">
              After making your payment, please take a screenshot of your payment receipt and attach it when you send your order via Messenger. This helps us verify and process your order quickly.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-noto font-medium text-black mb-6">Final Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-iskina-green/5 rounded-lg p-4 border border-iskina-green/10">
              <h4 className="font-medium text-black mb-2">Customer Details</h4>
              <p className="text-sm text-gray-600">Name: {customerName}</p>
              <p className="text-sm text-gray-600">Contact: {contactNumber}</p>
              {roomNumber && <p className="text-sm text-gray-600">Room: {roomNumber}</p>}
              <p className="text-sm text-gray-600">Service: {serviceType === 'room-service' ? 'Room Service' : 'Pickup'}</p>
              <p className="text-sm text-gray-600">
                {serviceType === 'room-service' ? 'Service Time' : 'Pickup Time'}: {pickupTime === 'custom' ? customTime : `${pickupTime} minutes`}
              </p>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-iskina-green/10">
                <div>
                  <h4 className="font-medium text-black">{item.name}</h4>
                  {item.selectedVariation && (
                    <p className="text-sm text-gray-600">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Add-ons: {item.selectedAddOns.map(addOn =>
                        addOn.quantity && addOn.quantity > 1
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">₱{item.totalPrice} x {item.quantity}</p>
                </div>
                <span className="font-semibold text-black">₱{item.totalPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-iskina-green/20 pt-4 mb-6">
            <div className="flex items-center justify-between text-2xl font-noto font-semibold text-black">
              <span>Total:</span>
              <span>₱{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 transform bg-iskina-green text-white hover:bg-iskina-dark hover:scale-[1.02]"
          >
            Place Order via Messenger
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            You'll be redirected to Facebook Messenger to confirm your order. Don't forget to attach your payment screenshot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;