const handleMathJax = (rerun = false) => {
    if (typeof window === 'undefined') {
      return;
    }
  
    const mathjaxScript = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [['\\(', '\\)'], ['$', '$']],
        },
        startup: {
            typeset: false
        }
      };
    }
  
    let mathjaxScriptTag = document.querySelector(`script[src="${mathjaxScript}"]`);
    if (!mathjaxScriptTag) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = mathjaxScript;
      script.onload = function () {
        window.MathJax.typesetPromise && window.MathJax.typesetPromise();
      };
      document.head.appendChild(script);
    } else if (rerun) {
      window.MathJax.typesetPromise && window.MathJax.typesetPromise();
    }
};
  
export default handleMathJax;