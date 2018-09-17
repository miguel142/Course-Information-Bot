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

client.on('ready', ()=> {
  console.log('The bot is now online!');
  client.user.setActivity('type !courseinfo');

});

client.on('message', message => {

  if(message.content.toLowerCase().startsWith("!courseinfo"))
  {

    var queryData = message.content.substring(12);
    console.log(queryData);
    var args = queryData.split("/");
    console.log(args);
    if(args.length != 3)
    {
      const embed = new Discord.RichEmbed()
      .setTitle("Course Information Bot")
      .addField("Invalid Entry:", "Specify a Department, the Course Abbreviation, and Course Number in this format: Department/Course Abbreviation/Course Number, e.g: French/FRE/101");
      message.channel.send({embed});
    }

    else
    {
        var department = args[0];
        var subject = args[1];
        var courseNumber = args[2];
        var formData = "USER=0009&DELIMITER=%5Ct&SUBST_STR=G%3AGraduate&SUBST_STR=U%3AUndergraduate&SUBST_STR=L%3ALab&SUBST_STR=D%3ADiscussion&SUBST_STR=S%3ASeminar&SUBST_STR=I%3AIndependent+Study&SUBST_STR=GRD%3AA-E&SUBST_STR=SUS%3ASatisfactory%2FUnsatisfactory&SUBST_STR=GLU%3ALoad+Credit+or+Unsatisfactory&SUBST_STR=GRU%3AResearch+Credit+or+Unsatisfactory&HEADING_FONT_FACE=Arial&HEADING_FONT_SIZE=3&HEADING_FONT_COLOR=black&RESULTS_PAGE_TITLE=&RESULTS_PAGE_BGCOLOR=%23F0F0F0&RESULTS_PAGE_HEADING=&RESULTS_PAGE_FONT_FACE=Arial&RESULTS_PAGE_FONT_SIZE=2&RESULTS_PAGE_FONT_COLOR=black&NO_MATCHES_MESSAGE=Sorry%2C+no+courses+were+found+that+match+your+criteria.&NO_PRINT=3&NO_PRINT=4&NO_PRINT=6&NO_PRINT=7&NO_PRINT=8&GREATER_THAN_EQ=26&NO_PRINT=26&Level=U&College_or_School=&Department_or_Program=" + department + "&Course_Subject="+subject+"&Course_Number="+courseNumber+"&Class_Number=&Course_Title=&Days=&Instructor=&Grading=&Course_Info=&Meeting_Info=&Comments=&Credit_Range=&Component_is_blank_if_lecture=&Topic_if_applicable=&Seats_remaining_as_of_last_update=&Session=&IT_Commons_Course=&Fully_Online_Course=&General_Education_Course=&Honors_College_Course=&Writing_Intensive_Course=&Oral_Discourse_Course=&Information_Literacy_Course=&Special_Restriction=";
        requestPDF(formData, message);
    }
  }
  /*
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


  } */


});

function requestPDF(formData, message)
{
  request.post({
      url: 'https://www.albany.edu/cgi-bin/general-search/search.pl',
      body: formData,
    }, function(error, response, body){

      var fs = require('fs');
      var https = require('https');
      var pageLink = "https://www.albany.edu/cgi-bin/general-search/search.pl?" + formData;
      console.log(pageLink);
      fs.writeFile('test.html', body, function(err) {
        if(err) throw err;
        console.log("Success!");
      });

      (async () => {
        const browser = await puppeteer.launch({headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],});
        const page = await browser.newPage();
        await page.goto(pageLink);
        await page.screenshot({path: './albany.png',
        fullPage: true});
        await browser.close();
        await message.channel.send('Course Info for Fall 2018:', {files: [new Discord.Attachment('./albany.png')]});
      })();

  });
}
/*
function addUserRole(roleName, message)
{
    var role = message.guild.roles.find('name', roleName);
    message.member.addRole(role.id);
    return;
}
*/
