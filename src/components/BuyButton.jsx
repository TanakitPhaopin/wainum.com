import * as React from 'react';

function BuyButton({email}) {
  // Paste the stripe-buy-button snippet in your React component
  return (
    <stripe-buy-button
      buy-button-id="buy_btn_1RMjXSAlnDo7ux3vFDPe1lFu"
      publishable-key="pk_test_51QfDlGAlnDo7ux3vzsbBpD10tShLmcofMQvtFPctJu3KCm3OtcGycfhflTc4nmjaJ5C6ofxSPFSuXc4keSzqCwcW00IqP3oKaD"
      customer-email={email}
    >
    </stripe-buy-button>
  );
}

export default BuyButton;