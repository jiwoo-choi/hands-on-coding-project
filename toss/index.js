(() => {


    function checkMenu(yOffset) {
        if (yOffset > 0) {
            document.getElementById('nav-bar').classList.add("bg-white");
        } else {
            document.getElementById('nav-bar').classList.remove("bg-white");
            // bg-transparent");

        }
    }


    document.addEventListener('scroll', () => {
        checkMenu(pageYOffset);
    })


    //function how to?
})();