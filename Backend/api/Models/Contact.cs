using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Contact
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        public string? Surname { get; set; }

        [Required]
        public required string PhoneNumber { get; set; }

        public string? CompanyName { get; set; }

        public string? CompanyPhoneNumber { get; set; }
        public string? Email { get; set; }
        public DateTime? Birthday { get; set; }

        public string? ProfileImage { get; set; }

        public Boolean Favourite { get; set; }

    }
}