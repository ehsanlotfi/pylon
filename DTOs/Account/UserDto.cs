using System;

namespace pylon.DTOs.Account
{
    public class InfoModel
    {
        public UserDto Info { get; set; }
        public string access_token { get; set; }
      
    }



    public class UserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string sub { get; set; }
        public Int32? exp { get; set; }
    }
}
