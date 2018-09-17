const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
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
    if(args.length != 2)
    {
      const embed = new Discord.RichEmbed()
      .setTitle("Course Information Bot")
      .addField("Invalid Entry:", "Specify a Department, the Course Abbreviation, and Course Number in this format: Department/Course Abbreviation/Course Number, e.g: French/FRE/101");
      message.channel.send({embed});
    }

    else
    {
        var subject = args[0];
        var courseNumber = args[1];
        var formData = "USER=0009&DELIMITER=%5Ct&SUBST_STR=G%3AGraduate&SUBST_STR=U%3AUndergraduate&SUBST_STR=L%3ALab&SUBST_STR=D%3ADiscussion&SUBST_STR=S%3ASeminar&SUBST_STR=I%3AIndependent+Study&SUBST_STR=GRD%3AA-E&SUBST_STR=SUS%3ASatisfactory%2FUnsatisfactory&SUBST_STR=GLU%3ALoad+Credit+or+Unsatisfactory&SUBST_STR=GRU%3AResearch+Credit+or+Unsatisfactory&HEADING_FONT_FACE=Arial&HEADING_FONT_SIZE=3&HEADING_FONT_COLOR=black&RESULTS_PAGE_TITLE=&RESULTS_PAGE_BGCOLOR=%23F0F0F0&RESULTS_PAGE_HEADING=&RESULTS_PAGE_FONT_FACE=Arial&RESULTS_PAGE_FONT_SIZE=2&RESULTS_PAGE_FONT_COLOR=black&NO_MATCHES_MESSAGE=Sorry%2C+no+courses+were+found+that+match+your+criteria.&NO_PRINT=3&NO_PRINT=4&NO_PRINT=6&NO_PRINT=7&NO_PRINT=8&GREATER_THAN_EQ=26&NO_PRINT=26&Level=U&College_or_School=&Department_or_Program=&Course_Subject="+subject+"&Course_Number="+courseNumber+"&Class_Number=&Course_Title=&Days=&Instructor=&Grading=&Course_Info=&Meeting_Info=&Comments=&Credit_Range=&Component_is_blank_if_lecture=&Topic_if_applicable=&Seats_remaining_as_of_last_update=&Session=&IT_Commons_Course=&Fully_Online_Course=&General_Education_Course=&Honors_College_Course=&Writing_Intensive_Course=&Oral_Discourse_Course=&Information_Literacy_Course=&Special_Restriction=";
        requestPDF(formData, message, message.author.username);
    }
  }


});

function requestPDF(formData, message, username)
{
  request.post({
      url: 'https://www.albany.edu/cgi-bin/general-search/search.pl',
      body: formData,
    }, function(error, response, body){

      var fs = require('fs');
      var pageLink = "https://www.albany.edu/cgi-bin/general-search/search.pl?" + formData;
      console.log(pageLink);
      
      (async () => {
        const browser = await puppeteer.launch({headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],});
        const page = await browser.newPage();
        await page.goto(pageLink);
        await page.screenshot({path: './' + username + '.png',
        fullPage: true});
        await browser.close();
        await message.channel.send('Course Info for Fall 2018:', {files: [new Discord.Attachment('./' + username + '.png')]});
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
