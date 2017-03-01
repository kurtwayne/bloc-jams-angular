(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc stores the album information
        * @type {Object}
        */
        var currentAlbum = Fixtures.getAlbum();
        
        var currentBuzzObject = null;
        
        /**
        * @function stopSong
        * @desc Stops currentBuzzObject and sets current song object to null
        * @param {Object} song
        */   
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(song);
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function playSong
        * @desc Plays currentBuzzObject and sets current song object to true
        * @param {Object} song
        */        
        var playSong = function(song) {
            setSong(song);
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @function getSongIndex
        * @desc gets the index of the song from currentAlbum
        * @param {Object} song
        */        
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc Active song object from list of songs
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        * @desc Current volume of currently playing song
        * @type {Number}
        */
        SongPlayer.volume = null;
        
        /**
        * @desc Current status of mute
        * @type {Object}
        */
        SongPlayer.mute = null;
        
        /**
        * @desc Status of volume
        * @type {Object}
        */
        SongPlayer.noVolume = null;
        
        /**
        * @desc Max volume of currently playing song
        * @type {Number}
        */
        SongPlayer.volumeMax = 100;
        
        /**
        * @function setVolume
        * @desc Sets volume for current or new song
        * @param {Object} volume
        */        
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.setVolume(volume);
            }
        };

        /**
        * @function muteVolume
        * @desc Mutes volume for current or new song
        * @param {Object} volume
        */   
        SongPlayer.muteVolume = function(volume) {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.mute();
                SongPlayer.noVolume = true;
            }
        };
        
        /**
        * @function unMute
        * @desc unMutes volume for current or new song
        * @param {Object} volume
        */   
        SongPlayer.unMute = function(volume) {
            if (currentBuzzObject) {
                SongPlayer.volume = currentBuzzObject.unmute();
                SongPlayer.noVolume = false;
            }
        };
    
        /**
        * @function play
        * @desc Play current or new song
        * @param {Object} song
        */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
        /**
        * @function pause
        * @desc Pause current song
        * @param {Object} song
        */
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function previous
        * @desc switch to previous song unless on first song then revert to first song
        */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong(song);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex > 5) {
                stopSong();
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
         /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
         SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();