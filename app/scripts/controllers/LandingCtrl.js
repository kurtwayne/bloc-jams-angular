(function() {
     function LandingCtrl() {
         // controller logic
         this.heroTitle = "Turn the Music Up!";
     }
 
     angular
         .module('blocJams')
         .controller('LandingCtrl', LandingCtrl);
})();