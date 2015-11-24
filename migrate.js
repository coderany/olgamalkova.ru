var fs = require('fs');

var dir = './_posts/';
var dir1 = './_posts1/';
var data = {};

fs.readdir(dir, function (err, files) {
  if (err) throw err;
  var c = 0;
  files.forEach(function (file) {
    c++;
    fs.readFile(dir + file, 'utf-8', function (err, content) {
      if (err) throw err;

      var i = 1;

      console.log(file);
      content.split('\n').forEach(function (row) {
        if (row.startsWith(' [')) {
          var indexOfCloseBracket = row.indexOf('http://static1.squarespace.com/static/');
          var indexOfLastSlash = row.lastIndexOf('/');

          if (row[indexOfLastSlash - 1] === '/') {
            indexOfLastSlash--;
          }
          var id = i;
          i++;
          var imgPath = row.substring(indexOfCloseBracket + 38 + 25,indexOfLastSlash);
          var imgUrl = row.substring(indexOfCloseBracket);
          var path = 'static/' + imgPath + '/';
          try {
            fs.readdir(path, function (err, files) {
              if(err){
                console.log(file, err);
                return;
              }
              var fp = path+files[0];
              var stats = fs.statSync(fp);
              console.log(file,path, stats.size);
              try {
                fs.mkdirSync('static/images/' + file.substring(0,file.length-3) + '/');
              } catch(e) {
//                console.log(e)
              }
              var target = 'static/images/' + file.substring(0,file.length-3) + '/' + id+ '.jpg';
              copyFile(fp,target, function(e){
                console.log(file, imgUrl, '/'+ target,e);
                content = content.replace(imgUrl, '/'+ target);
               // console.log(content)
                fs.writeFile(dir1 + file, content, function(err) {
                  if(err) {
                    return console.log(err);
                  }
                });
              });
            });
          }
          catch (e) {
            //console.log('failed to find file ' + file + ' ... downloading');
          }
        }
      });
    });
  });
});

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}