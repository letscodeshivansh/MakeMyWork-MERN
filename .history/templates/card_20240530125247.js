<button type="button" class="btn btn-outline-dark"  onclick="loadScript('./card.js')">Find Work</button>
              <script>
                function loadScript(scriptUrl) {
                  var script = document.createElement('script');
                  script.src = scriptUrl;
                  document.head.appendChild(script);
                }
              </script>