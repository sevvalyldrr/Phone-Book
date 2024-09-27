using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using Microsoft.AspNetCore.Mvc;
using api.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using NLog;
using ILogger = NLog.ILogger;

namespace api.Controllers
{
    [Route("api/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private static readonly ILogger logger = LogManager.GetCurrentClassLogger();
        private readonly ApplicationDBContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public ContactController(ApplicationDBContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            logger.Info("GetAll method called."); 
            var contacts = _context.Contacts.ToList();
            logger.Info($"{contacts.Count} contacts retrieved."); 
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            logger.Info($"GetById method called with id: {id}"); 
            var contact = _context.Contacts.Find(id);

            if (contact == null)
            {
                logger.Warn($"Contact with id {id} not found."); 
                return NotFound();
            }

            logger.Info($"Contact with id {id} retrieved."); 
            return Ok(contact);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Contact contact)
        {
            logger.Info("Create method called."); 

            if (contact == null)
            {
                logger.Error("Contact is null."); 
                return BadRequest("Contact is null.");
            }

            if (string.IsNullOrWhiteSpace(contact.Name) || string.IsNullOrWhiteSpace(contact.PhoneNumber))
            {
                logger.Error("Name and PhoneNumber are required."); 
                return BadRequest("Name and PhoneNumber are required.");
            }

            _context.Contacts.Add(contact);
            _context.SaveChanges();
            logger.Info($"Contact created with id: {contact.Id}");

            return CreatedAtAction(nameof(GetById), new { id = contact.Id }, contact);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            logger.Info($"Delete method called with id: {id}"); 
            var contact = _context.Contacts.Find(id);
            if (contact == null)
            {
                logger.Warn($"Contact with id {id} not found for deletion."); 
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            _context.SaveChanges();
            logger.Info($"Contact with id {id} deleted."); 

            return NoContent();
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] Contact updatedContact)
        {
            logger.Info($"Update method called for contact id: {id}"); 

            if (id != updatedContact.Id)
            {
                logger.Error("Contact ID mismatch."); 
                return BadRequest();
            }

            var contact = _context.Contacts.Find(id);
            if (contact == null)
            {
                logger.Warn($"Contact with id {id} not found for update."); 
                return NotFound();
            }

            contact.Name = updatedContact.Name;
            contact.Surname = updatedContact.Surname;
            contact.PhoneNumber = updatedContact.PhoneNumber;
            contact.CompanyName = updatedContact.CompanyName;
            contact.CompanyPhoneNumber = updatedContact.CompanyPhoneNumber;
            contact.Email = updatedContact.Email;
            contact.Birthday = updatedContact.Birthday;
            contact.ProfileImage = updatedContact.ProfileImage;
            contact.Favourite = updatedContact.Favourite;

            _context.Contacts.Update(contact);
            _context.SaveChanges();
            logger.Info($"Contact with id {id} updated."); 

            return Ok(contact);
        }

        [HttpPost("{id}/upload-image")]
        public async Task<IActionResult> UploadProfileImage(int id, IFormFile file)
        {
            logger.Info($"UploadProfileImage method called for contact id: {id}"); 

            if (file == null || file.Length == 0)
            {
                logger.Error("File is null or empty."); 
                return BadRequest("Resim yüklenemedi.");
            }

            var fileName = Path.GetRandomFileName() + Path.GetExtension(file.FileName);
            var directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
                logger.Info("Created directory for images: " + directoryPath);
            }

            var filePath = Path.Combine(directoryPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            logger.Info($"Image uploaded successfully for contact id: {id}. File path: {filePath}"); 
            return Ok(new { path = filePath });
        }

        [HttpGet("check-phone/{phoneNumber}")]
        public async Task<IActionResult> CheckPhoneNumber(string phoneNumber)
        {
            logger.Info($"CheckPhoneNumber method called for phone number: {phoneNumber}"); 
            var exists = await _context.Contacts.AnyAsync(c => c.PhoneNumber == phoneNumber);
            logger.Info($"Phone number {phoneNumber} exists: {exists}"); 
            return Ok(exists);
        }
    }
}
