let TokenPay = function (publicKey) {
  if (!publicKey) {
      console.error('Key is required');
      return;
  }

  var payFrame = {
      publicKey: publicKey,
      useACH: false
  };

  var iframe;
  var dataElement;
  var errorMessage;
  var onSuccess;
  var onFailure;

  window.addEventListener('message', function (event) {
      switch (event.data.type) {
          case 'validation':
              if (errorMessage) {
                  if (event.data.data.errorMessage) {
                      errorMessage.textContent = event.data.data.errorMessage;
                      errorMessage.style.display = "block";
                      if (onFailure) {
                          return event.data.data;
                      }
                  } else {
                      errorMessage.style.display = "none";
                  }
              }
              break;
          case 'success':
              if (onSuccess) {
                  onSuccess(event.data.data);
              }
              errorMessage.style.display = "none";
              break;
          case 'error':
              if (onFailure) {
                  onFailure(event.data.data);
              }
              errorMessage.textContent = "Error submitting payment.";
              errorMessage.style.display = "block";
              break;
      };
  });

  var _createIframe = function () {
      var iframe = document.createElement('iframe');
      iframe.id = "payFrame";
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute("allowtransparency", "true");
      iframe.style.cssText = "height:100%;width:100%";
      iframe.scrolling = "no";
      iframe.onload = function () {
          this.contentWindow.postMessage({ _payFrame: payFrame }, '*');
      };

      var isIE = /*@cc_on!@*/false || !!document.documentMode;

      if (isIE) {
        //Needs to be the ie-js URL
        iframe.src =
          "https://rhuat.bridgepaynetsecuretest.com/WebSecurity/TokenPay/ie-js/dataValidator.html";
      } else {
        //Needs to be the js URL
        iframe.src =
          "https://rhuat.bridgepaynetsecuretest.com/WebSecurity/TokenPay/js/dataValidator.html";
      }

      /* if (isIE) {
          //Needs to be the ie-js URL
          iframe.src = "https://www.bridgepaynetsecuretest.com/WebSecurity/TokenPay/ie-plain-js/dataValidator.html";
      } else {
          //Needs to be the js URL
          iframe.src = "https://www.bridgepaynetsecuretest.com/WebSecurity/TokenPay/plain-js/dataValidator.html";
      } */

      return iframe;
  };

  return {
      initialize: function (config) {
          if (iframe && document.body.contains(iframe)) {
              console.error('TokenPay is already initialized');
              return;
          };
          
          if (config && config.dataElement) {
              dataElement = document.querySelector(config.dataElement);
              errorMessage = document.querySelector(config.errorElement);

              if (!dataElement) {
                  throw new Error('TokenPay: can\'t find element by selector: ' + config.dataElement);
              }

              if (!errorMessage) {
                  console.warn('TokenPay: can\'t find element by selector: ' + config.errorElement);
              }

              if (config.useStyles) {
                  payFrame.customStyles = document.querySelector("customStyles").textContent;
              }

              payFrame.useACH = (config.useACH) ? config.useACH : false;
              payFrame.disableCvv = (config.disableCvv) ? config.disableCvv : false;
              payFrame.disableZip = (config.disableZip) ? config.disableZip : false;

              dataElement.innerHTML = "";
              iframe = _createIframe();
              payFrame.added = true;
              dataElement.appendChild(iframe);

          } else {
              console.error('Card data element is required');
          }
      },
      createToken: function (success, error) {
          //var iframe = document.getElementById("payFrame").contentWindow;
          onSuccess = success;
          onFailure = error;
          iframe.contentWindow.postMessage({ action: "submit" }, '*');
      }
  };
};
export default TokenPay