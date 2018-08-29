const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const https = require('https');
const puppeteer = require('puppeteer');
const botinfo = require("./botinfo.json");
const commands = require('./commands.js');
var department, subject, courseNumber = "";

var timeStarted;
client.login(botconfig.token);

client.on('guildMemberAdd', member => {

console.log("A new user has arrived!");
member.send("Welcome to the server");

});
client.on('ready', ()=> {
  console.log('The bot is now online!');
  client.user.setActivity('type !courseinfo');

});

client.on('message', message => {
/*
  if(message.channel.name === "welcome")
  {
    console.log("User sent a message in the welcome channel");
    if(message.content.toLowerCase() === 'i agree')
    {
      console.log("User agreed to terms and rules");
      addUserRole('New User', message);
      message.author.send("Congratulations! You now have access to all of the server channels!");
      message.delete();
    }
    else {
      // Delete a message
message.delete()
  .then(msg => console.log(`Deleted message from ${msg.author.username}`))
  .catch(console.error);
    }
  }

  if(message.content.toLowerCase().startsWith("!addrole"))
  {
    var args = message.content.toLowerCase().split(" ");
    console.log(args);
    if(args[1] === 'sa2018')
    {
      var role = message.guild.roles.find('name', 'Steam Awards 2018');
      console.log("Role found!");
      message.member.addRole(role.id);
      message.channel.send('Role successfully added!');

    }
    else if(args[1] === 'helper')
    {
      addUserRole('Helper', message);
      message.channel.send('Role successfully added!');
    }
    else if(args[1] === 'youtuber')
    {

    }
  }


  else if (message.content.toLowerCase() === '!save')
  {


    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('https://www.albany.edu/');
      await page.screenshot({path: 'albany.png', fullPage: true});
      await browser.close();
      await message.channel.send("Here's what the front page of UAlbany's website looks like: ", {files: ['./albany.png']});
    })();


  }
  */
  if(message.content.toLowerCase() === '!courseinfo')
  {


    //console.log(dept + subject + course);
    message.channel.send("Enter your line as follows: Department/Subject/Course Number\ni.e: Computer Science/CSI/333\nFor more ");
    const filter = m => (!m.author.bot);
    message.channel.awaitMessages(filter, {max: 1, time: 0, errors: ['time']})
    .then(collected => {
      console.log(collected.first().content);
      var info = collected.first().content.split("/");

      console.log(info.length);
      /*
      department = info[0];
      subject = info[1];
      courseNumber = info[2]; */
      if(info.length === 1)
      {
        console.log("Need more arguments");
      }
      else if(info.length == 2)
      {
        department = info[0];
        subject = info[1];
        courseNumber = "";
      }
      else if(info.length == 3)
      {
        department = info[0];
        subject = info[1];
        courseNumber = info[2];
      }


      var formData = "USER=0009&DELIMITER=%5Ct&SUBST_STR=G%3AGraduate&SUBST_STR=U%3AUndergraduate&SUBST_STR=L%3ALab&SUBST_STR=D%3ADiscussion&SUBST_STR=S%3ASeminar&SUBST_STR=I%3AIndependent+Study&SUBST_STR=GRD%3AA-E&SUBST_STR=SUS%3ASatisfactory%2FUnsatisfactory&SUBST_STR=GLU%3ALoad+Credit+or+Unsatisfactory&SUBST_STR=GRU%3AResearch+Credit+or+Unsatisfactory&HEADING_FONT_FACE=Arial&HEADING_FONT_SIZE=3&HEADING_FONT_COLOR=black&RESULTS_PAGE_TITLE=&RESULTS_PAGE_BGCOLOR=%23F0F0F0&RESULTS_PAGE_HEADING=&RESULTS_PAGE_FONT_FACE=Arial&RESULTS_PAGE_FONT_SIZE=2&RESULTS_PAGE_FONT_COLOR=black&NO_MATCHES_MESSAGE=Sorry%2C+no+courses+were+found+that+match+your+criteria.&NO_PRINT=3&NO_PRINT=4&NO_PRINT=6&NO_PRINT=7&NO_PRINT=8&GREATER_THAN_EQ=26&NO_PRINT=26&Level=U&College_or_School=&Department_or_Program=" + department + "&Course_Subject="+subject+"&Course_Number="+courseNumber+"&Class_Number=&Course_Title=&Days=&Instructor=&Grading=&Course_Info=&Meeting_Info=&Comments=&Credit_Range=&Component_is_blank_if_lecture=&Topic_if_applicable=&Seats_remaining_as_of_last_update=&Session=&IT_Commons_Course=&Fully_Online_Course=&General_Education_Course=&Honors_College_Course=&Writing_Intensive_Course=&Oral_Discourse_Course=&Information_Literacy_Course=&Special_Restriction=";

      requestPDF(formData, message);
    }).catch(collected => console.log(""));

  }

  else if(message.content === '!q')
  {
    const filter = m => (!m.author.bot);
    message.channel.send("Say something");
    message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time'] })
    .then(collected => {
      if(message.author.username === collected.first().author.username)
      {
        console.log("Same user responded!");
        message.channel.send("Same user responded");
      }
      else
      {
        message.channel.send("No one asked you" + collected.first().author);
      }
    })
    .catch(collected => console.log(collected));
  }

  else if(message.content.toLowerCase().startsWith("!roleadd"))
  {
    console.log("User trying to add themselves to a role.");
    var args = message.content.toLowerCase().split(" ");

    var rolesAdded = [];
    var notAdded = [];
    if(args.length > 1)
    {
      var i = 1;
      while(i<args.length)
      {
        if(botinfo.hasOwnProperty(args[i])) // Check if the role exists in the JSON file.
        {
          var role = message.guild.roles.find('name', botinfo[args[i]]);
          if(role != null && !(message.member.roles.has(role.id))) // I don't really need the role != null part, but I'm scared so I won't risk it :D
          {
            rolesAdded.push(botinfo[args[i]]); // All of the existing roles, and the roles the user is not assigned to yet.
            message.member.addRole(role.id);
          }
          else
            notAdded.push(botinfo[args[i]]); // All of the roles that do not exist, and will not be assigned to the user.

        }
        i++; // increment loop
      }

      function displayLog()
      {
        if(rolesAdded.length>0)
          message.channel.send(message.author + " has been added to the following role(s): " + rolesAdded.join(", "));
        if(notAdded.length > 0)
          message.channel.send("You were not added to the following role(s): " + notAdded.join(", "));
      }

      setTimeout(displayLog, 2000);

    }

    else {

    }

  }
  else if(message.content == '!race')
  {
    message.channel.startTyping();
    setTimeout(function after(){
      message.channel.send("Hello");
    }, 10000)

    message.channel.stopTyping();
  }
  else if(message.content.startsWith("!test"))
  {
    var commandTime = message.createdAt; // Log the time the command was triggered.
    console.log("!test was triggered at " + commandTime);
    message.channel.send("SUNY Albany is a great school to attend if you enjoy being closer to the Adirondacks.");
    const filter = m => (m.author == message.author);
    message.channel.awaitMessages(filter, {max: 1, errors: ['time']})
    .then(collected=> {console.log("Message submitted at " + collected.array()[0].createdAt);

    var t1 = commandTime.getSeconds();
    var t2 = collected.array()[0].createdAt.getSeconds();

    console.log(t1 + " " + t2);
    var totalSeconds = t2-t1;
    if(totalSeconds < 0)
    {
      totalSeconds += 60;
    }
    message.channel.send("It took you " + totalSeconds + " seconds to type that entire sentence! Your average WPM is: " + Math.ceil(((85/5)/(totalSeconds/60))));


    }).catch(collected => console.log("Error"));


  }


});

/*
client.on('typingStart', (channel, user) => {
  if(user.username == 'Anson')
  {
    console.log(user.typingSinceIn(channel));
    timeStarted = user.typingSinceIn(channel); // Store in variable.
  }
}); */

function requestPDF(formData, message)
{
  request.post({
      url: 'https://www.albany.edu/cgi-bin/general-search/search.pl',
      body: formData,
    }, function(error, response, body){

      var fs = require('fs');
      var https = require('https');

      fs.writeFile('test.html', body, function(err) {
        if(err) throw err;
        console.log("Success!");
      });

      (async () => {
        const browser = await puppeteer.launch({headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],});
        const page = await browser.newPage();
        //await page.goto("file:///C:/Users/Anson/Desktop/Course-Information-Bot/test.html");
        await page.goto("~/Course-Information-Bot/test.html");
        await page.screenshot({path: './albany.png',
        fullPage: true});
        await browser.close();
        await message.channel.send('Course Info for Fall 2018:', {files: ['./albany.png']});
      })();

  });
}
/*
function convert(fileName, message)
{
  let file = "./Major_MAPS/" + fileName + ".pdf";
  let opts = {
      format: 'png',
      out_dir: path.dirname(file),
      out_prefix: path.basename(file, path.extname(file)),
      page: null
  }
  pdf.convert(file, opts)
  .then(res => {
      console.log('Successfully converted');
      message.channel.send('Hours of Operation: ', {files: ['./Major_MAPS/' + fileName + '-1.png']});
  })
  .catch(error => {
      console.error(error);
  });
}
*/
function addUserRole(roleName, message)
{
    var role = message.guild.roles.find('name', roleName);
    message.member.addRole(role.id);
    return;
}
