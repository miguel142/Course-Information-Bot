const botinfo = require('./botinfo.json');
module.exports = {

  addRole: function(message)
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
  },
  removeRole: function()
  {
    console.log("Removing role...");
  },
  name: "Anson",
}
