const botconfig = require('./botconfig.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const https = require('https');
const puppeteer = require('puppeteer');
var department, subject, courseNumber = "";


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

  else if(message.content.toLowerCase() === '!hours')
  {
    convert("hours", message);

  }

  else if(message.content.toLowerCase() === '!accpdf')
  {
    convert("accounting", message);
  }

  else if(message.content.toLowerCase() === '!albany')
  {
    message.channel.send("Here's a picture of UAlabny's Football Field: ", {files: ['./ua.jpg']});
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
    message.channel.send("Enter your line as follows: Department/Subject/Course Number\ni.e: Computer Science/CSI/333");
    const filter = m => (!m.author.bot);
    message.channel.awaitMessages(filter, {max: 1, time: 0, errors: ['time']})
    .then(collected => {
      console.log(collected.first().content);
      var info = collected.first().content.split("/");

      console.log(info.length);

      department = info[0];
      subject = info[1];
      courseNumber = info[2];

      var formData = "USER=0009&DELIMITER=%5Ct&SUBST_STR=G%3AGraduate&SUBST_STR=U%3AUndergraduate&SUBST_STR=L%3ALab&SUBST_STR=D%3ADiscussion&SUBST_STR=S%3ASeminar&SUBST_STR=I%3AIndependent+Study&SUBST_STR=GRD%3AA-E&SUBST_STR=SUS%3ASatisfactory%2FUnsatisfactory&SUBST_STR=GLU%3ALoad+Credit+or+Unsatisfactory&SUBST_STR=GRU%3AResearch+Credit+or+Unsatisfactory&HEADING_FONT_FACE=Arial&HEADING_FONT_SIZE=3&HEADING_FONT_COLOR=black&RESULTS_PAGE_TITLE=&RESULTS_PAGE_BGCOLOR=%23F0F0F0&RESULTS_PAGE_HEADING=&RESULTS_PAGE_FONT_FACE=Arial&RESULTS_PAGE_FONT_SIZE=2&RESULTS_PAGE_FONT_COLOR=black&NO_MATCHES_MESSAGE=Sorry%2C+no+courses+were+found+that+match+your+criteria.&NO_PRINT=3&NO_PRINT=4&NO_PRINT=6&NO_PRINT=7&NO_PRINT=8&GREATER_THAN_EQ=26&NO_PRINT=26&Level=U&College_or_School=&Department_or_Program=" + department + "&Course_Subject="+subject+"&Course_Number="+courseNumber+"&Class_Number=&Course_Title=&Days=&Instructor=&Grading=&Course_Info=&Meeting_Info=&Comments=&Credit_Range=&Component_is_blank_if_lecture=&Topic_if_applicable=&Seats_remaining_as_of_last_update=&Session=&IT_Commons_Course=&Fully_Online_Course=&General_Education_Course=&Honors_College_Course=&Writing_Intensive_Course=&Oral_Discourse_Course=&Information_Literacy_Course=&Special_Restriction=";

      requestPDF(formData, message);
    }).catch(collected => console.log(""));

  }


});

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
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("file:///C:/Users/Anson/Desktop/Course-Information-Bot/test.html");
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
