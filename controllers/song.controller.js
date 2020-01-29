/* ********** MODELS ********** */

const SongModel = require('../models/song.model');
const UserModel = require('../models/user.model');

/* ********** OPERATIONS ********** */

    /* ********** GET ALL ********** */

        exports.getAll = function (req, res) {
          SongModel.find((error, songs) => {
            if(error){
              console.log('Error | getAllSongs.' + error);
            }else{

              let dates = new Array();
              let options = { year: 'numeric', month: 'long', day: 'numeric' };

              songs.forEach((song) => {
                let date = song.created_at;
                date = date.toLocaleDateString("en-US", options);
                dates.push(date);
                song.lyrics = song.lyrics.substring(0, 200);
              });

              res.render('index' , {
                layout: 'main',
                createdSong: req.flash('createdSong'),
                deletedSong: req.flash('deletedSong'),
                userRegistered: req.flash('userRegistered'),
                userLoggedOut: req.flash('userLoggedOut'),
                alreadyLoggedIn: req.flash('alreadyLoggedIn'),
                message: req.flash('error'),
                success: req.flash('success'),
                songs: songs,
                dates: dates
              });
            }
          }).populate('author');
        };

    /* ********** CREATE ********** */

        exports.createView = (req, res) => {
          res.render('song/createORupdate' ,{
            title: 'Suggest New Song',
            layout: 'main'
          });
        };

        exports.create = (req, res, next) => {

          // Create Movie Object

          let song = new SongModel({
            name: req.body.name,
            lyrics: req.body.lyrics,
            image: req.body.image,
            author: req.user._id
          });

          // Save Movie

          song.save((error) => {
            if(!error){

              // Push Movie User Movies Array | Relationships

              UserModel.findById(song.author, (error, user) => {
                if(error)
                  return next(error);
            
                user.songs.push(song._id);
                user.save();    
              });

              req.flash('createdSong', 'Song "' + req.body.name + '" Successfully Suggested.')
              res.redirect('/');
            }else{
              if(error.name == 'ValidationError'){
                handleValidationErrors(error, req.body);
                res.render("song/createORupdate", {
                  title: "Suggest New Song",
                  song: req.body,
                  userLel: req.user
                });
              }
              else
                console.log("Error: " + error);
            }
          });
        };

    /* ********** READ ********** */

        exports.read = (req, res, next) => {

          let correctUser = false;

          // Find Movie 

          SongModel.findById(req.params.id, (error, song) => {

            if(!song)
              return next(); // Failed To Cast Ako Nema Slike

            if(error){
              return next(error);
            }

            // Find User For That Movie 

            UserModel.findById(song.author, (error, user) => {
              
              if(error)
                return next(error);

              // Check If User Is Author So He Can Edit And Delete Movie
              
              if(req.user && user && String(req.user._id) == String(user._id)){
                correctUser = true
              }

              let options = { year: 'numeric', month: 'long', day: 'numeric' };
              let date = song.created_at;
              date = date.toLocaleDateString("en-US", options);

              res.render('song/read' , {
                layout: 'main',
                song: song,
                date: date,
                updatedSong: req.flash('updatedSong'),
                notAuthorized: req.flash('notAuthorized'),
                user: user,
                correctUser: correctUser,
              });
            });

          });
        };

    /* ********** UPDATE ********** */

        exports.updateView = (req, res, next) => {
          SongModel.findById(req.params.id, (error, song) => {
            if(error){
              return next(error);
            }

            let omg1 = String (song.author);
            let omg2 = String (req.user._id);

            if(omg1 != omg2){
              req.flash('notAuthorized', 'Not Authorized.');
              res.redirect('/song/' + song._id);
            }else{
              res.render('song/createORupdate', {
                title: 'Update Song "' + song.name + '".',
                layout: 'main',
                song: song,
                updating: true,
              });
            }
          });
        };

        exports.update = (req, res, next) => {
          SongModel.findByIdAndUpdate(req.params.id, {
            $set: req.body
          }, (error, song) => {
            if(error)
              return next(error);
            
            req.flash('updatedSong', 'Song "' + req.body.name + '" Successfully Updated.')
            res.redirect('/song/' + req.params.id);
          });
        };

    /* ********** DELETE ********** */

        exports.delete = (req, res, next) => {
          SongModel.findByIdAndRemove(req.params.id, (error, song) => {
            if(error){
              return next(error);
            }

            // Moram Izbrisati Iz User Movies Ovaj Movie I Sve Komentare Vezane Za Taj Film Kao i Kad Brisem Komentare Onda I Iz Usera Moram Komentare || Ovo mora da moze lakse

            UserModel.findById(song.author, (error, user) => {
              if(error)
                return next(error);

              user.songs.pull({_id: req.params.id});
              user.save(); 
            });

            req.flash('deletedSong', 'Song "' + song.name + '" Successfully Deleted.')
            res.redirect('/');
          });
        };

/* ********** METHODS ********** */

    function handleValidationErrors(error, body){
      for(field in error.errors){
        switch(error.errors[field].path){
          case 'name':
            body['nameError'] = error.errors[field].message;
            break;
          case 'lyrics':
            body['lyricsError'] = error.errors[field].message;
            break;
        }
      }
    }