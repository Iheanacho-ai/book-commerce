import ProductDisplay from "../components/product-display";
import SuccessDisplay from "../components/success-display";
import Message from "../components/message";
import { useState, useEffect } from "react";

const Pricing = () => {
    let [message, setMessage] = useState('');
    let [success, setSuccess] = useState(false);
    let [sessionId, setSessionId] = useState('');
  
    useEffect(() => {
      // Check to see if this is a redirect back from Checkout
      const query = new URLSearchParams(window.location.search);
  
      if (query.get('success')) {
        setSuccess(true);
        setSessionId(query.get('session_id'));
      }
  
      if (query.get('canceled')) {
        setSuccess(false);
        setMessage(
          "Order canceled -- continue to shop around and checkout when you're ready."
        );
      }
    }, [sessionId]);
  
    if (!success && message === '') {
      return <ProductDisplay />;
    } else if (success && sessionId !== '') {
      return <SuccessDisplay sessionId={sessionId} />;
    } else {
      return <Message message={message} />;
    }
}

export default Pricing;