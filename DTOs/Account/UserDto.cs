using System;

namespace pylon.DTOs.Account
{
    public class InfoModel
    {
     //   public string token_type { get; set; }
        //public Int64 id_token_expires_at { get; set; } = 1694498634000;
        //public Int64? expires_at { get; set; } = 1694498643208;
        //public Int64? access_token_stored_at { get; set; } = 1694495044208;
     //   public Int64? expires_in { get; set; } 
      //  public string id_token { get; set; }
      //  public string refresh_token { get; set; }
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
