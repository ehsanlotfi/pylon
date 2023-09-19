using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace pylon.Controllers
{
    public class FileStorageController : ControllerBase
    {
        private const string StoragePath = "Storags";

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFiles([FromForm] IFormFileCollection files)
        {
            try
            {
                var uploadedFileNames = new List<string>();
                var allowedFileTypes = new List<string> { ".jpg", ".jpeg", ".png", ".gif" }; // Add allowed file extensions

                // Create the storage directory if it doesn't exist
                if (!Directory.Exists(StoragePath))
                {
                    Directory.CreateDirectory(StoragePath);
                }

                foreach (var file in files)
                {
                    // Check file size (e.g., 10MB limit)
                    if (file.Length > 10 * 1024 * 1024) // 10MB in bytes
                    {
                        return BadRequest($"File {file.FileName} exceeds the maximum allowed size.");
                    }

                    // Check file type (extension)
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    if (!allowedFileTypes.Contains(fileExtension))
                    {
                        return BadRequest($"File {file.FileName} has an invalid file type.");
                    }

                    // Generate a unique GUID as the file name
                    var uniqueFileName = Guid.NewGuid().ToString() + fileExtension;
                    var filePath = Path.Combine(StoragePath, uniqueFileName);

                    // Check if the file already exists
                    if (System.IO.File.Exists(filePath))
                    {
                        // Handle the case of a duplicate GUID (e.g., update the existing file)
                        // Here, we'll append a timestamp to make the filename unique
                        uniqueFileName = Guid.NewGuid().ToString() + "_" + DateTime.Now.Ticks + fileExtension;
                        filePath = Path.Combine(StoragePath, uniqueFileName);
                    }

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    uploadedFileNames.Add(uniqueFileName); // Add the uploaded file name to the list
                }

                return Ok(uploadedFileNames); // Return the list of uploaded file names
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error uploading files: {ex.Message}");
            }
        }




        [HttpPost("remove")]
        public IActionResult RemoveFiles([FromBody] string[] fileNames)
        {
            try
            {
                foreach (var fileName in fileNames)
                {
                    var filePath = Path.Combine(StoragePath, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                var successResponse = new { Message = "Files removed successfully" };
                return Ok(successResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error removing files: {ex.Message}");
            }
        }

    }
}
