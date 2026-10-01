document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     Footer year
  ========================================================= */

  const yearEl = document.getElementById('year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* =========================================================
     Mobile nav toggle
  ========================================================= */

  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {

    navToggle.addEventListener('click', () => {

      const isOpen = mainNav.classList.toggle('is-open');

      navToggle.setAttribute(
        'aria-expanded',
        String(isOpen)
      );

    });


    mainNav.querySelectorAll('.nav-link').forEach((link) => {

      link.addEventListener('click', () => {

        mainNav.classList.remove('is-open');

        navToggle.setAttribute(
          'aria-expanded',
          'false'
        );

      });

    });

  }


  /* =========================================================
     Scroll-spy
     Highlight the navigation link for the section in view
  ========================================================= */

  const sections = document.querySelectorAll(
    'main section[id]'
  );

  const navLinks = document.querySelectorAll(
    '.nav-link'
  );


  const setActiveLink = (id) => {

    navLinks.forEach((link) => {

      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${id}`
      );

    });

  };


  if (
    'IntersectionObserver' in window &&
    sections.length
  ) {

    const observer = new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }

        });

      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      }
    );


    sections.forEach((section) => {
      observer.observe(section);
    });

  }


  /* =========================================================
     Contact form — Formspree
  ========================================================= */

  const form = document.getElementById(
    'contact-form'
  );

  const status = document.getElementById(
    'form-status'
  );


  if (form && status) {

    form.addEventListener(
      'submit',
      async (e) => {

        /*
         * IMPORTANT:
         * Prevent the browser from navigating to Formspree.
         */
        e.preventDefault();


        /* -----------------------------------------------------
           Validate form
        ----------------------------------------------------- */

        if (!form.checkValidity()) {

          status.textContent =
            'Please fill in every field before sending.';

          status.classList.remove(
            'is-success'
          );

          form.reportValidity();

          return;
        }


        /* -----------------------------------------------------
           Get form elements
        ----------------------------------------------------- */

        const submitButton =
          form.querySelector(
            'button[type="submit"]'
          );

        const nameInput =
          form.querySelector('#name');


        const name =
          nameInput
            ? nameInput.value.trim()
            : 'there';


        /* -----------------------------------------------------
           Loading state
        ----------------------------------------------------- */

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.textContent =
            'Sending...';

        }


        status.textContent = '';

        status.classList.remove(
          'is-success'
        );


        /* -----------------------------------------------------
           Send to Formspree
        ----------------------------------------------------- */

        try {

          const response = await fetch(
            form.action,
            {
              method: 'POST',

              body: new FormData(form),

              headers: {
                Accept: 'application/json'
              }
            }
          );


          /* ---------------------------------------------------
             Successful submission
          --------------------------------------------------- */

          if (response.ok) {

            const firstName =
              name.split(' ')[0];


            status.textContent =
              `Thanks, ${firstName} — your message has been sent successfully.`;


            status.classList.add(
              'is-success'
            );


            /* Clear the form */

            form.reset();

          }


          /* ---------------------------------------------------
             Formspree returned an error
          --------------------------------------------------- */

          else {

            const data =
              await response
                .json()
                .catch(() => ({}));


            if (
              data.errors &&
              data.errors.length
            ) {

              status.textContent =
                data.errors
                  .map(
                    (error) =>
                      error.message
                  )
                  .join(', ');

            }

            else {

              status.textContent =
                'Something went wrong. Please try again.';

            }


            status.classList.remove(
              'is-success'
            );

          }

        }


        /* -----------------------------------------------------
           Network error
        ----------------------------------------------------- */

        catch (error) {

          console.error(
            'Formspree submission error:',
            error
          );


          status.textContent =
            'Unable to send your message right now. Please try again later.';


          status.classList.remove(
            'is-success'
          );

        }


        /* -----------------------------------------------------
           Restore button
        ----------------------------------------------------- */

        finally {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
              'Send message';

          }

        }

      }
    );

  }


  /* =========================================================
     Animated circuit-trace current
  ========================================================= */

  const traceField =
    document.querySelector(
      '.trace-field'
    );


  if (
    traceField &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    const traceLines =
      traceField.querySelectorAll(
        '.trace-line'
      );


    traceLines.forEach(
      (line, index) => {

        const length =
          line.getTotalLength();


        /* Set up the travelling animation */

        line.style.strokeDasharray =
          `${length} ${length}`;


        line.style.strokeDashoffset =
          length;


        /* Animate the existing circuit line */

        line.animate(
          [
            {
              strokeDashoffset: length
            },

            {
              strokeDashoffset: -length
            }
          ],
          {
            duration:
              9000 + (index * 1800),

            delay:
              index * 900,

            iterations:
              Infinity,

            easing:
              'linear'
          }
        );

      }
    );

  }

});