export function CryptoPolyfillScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          if (typeof window !== 'undefined') {
            if (!window.crypto) {
              window.crypto = {
                getRandomValues: function(arr) {
                  for (let i = 0; i < arr.length; i++) {
                    arr[i] = Math.floor(Math.random() * 256);
                  }
                  return arr;
                }
              };
            }
            if (!window.crypto.randomUUID) {
              window.crypto.randomUUID = function() {
                return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
              };
            }
          }
        `,
      }}
    />
  );
} 