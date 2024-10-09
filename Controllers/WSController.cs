using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using pylon.Models;
using pylon.Data;
using System.Linq;

namespace pylon.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WSController: ControllerBase
    {
        private readonly Context _context;

        public WSController(Context context)
        {
            _context = context;
        }

        // GET: api/WS
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WS>>> GetWS()
        {
            return await _context.WS.ToListAsync();
        }

        // GET: api/WS/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WS>> GetWS(int id)
        {
            var WS = await _context.WS.FindAsync(id);

            if (WS == null)
            {
                return NotFound();
            }

            return WS;
        }

        // PUT: api/WS/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWS(int id, WS WS)
        {
            if (id != WS.Id)
            {
                return BadRequest();
            }

            WS.UpdatedAt = DateTime.UtcNow;
            _context.Entry(WS).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WSExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/WS
        [HttpPost]
        public async Task<ActionResult<WS>> PostWS(WS WS)
        {
            WS.CreatedAt = DateTime.UtcNow;
            WS.UpdatedAt = DateTime.UtcNow;
            _context.WS.Add(WS);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWS", new { id = WS.Id }, WS);
        }

        // DELETE: api/WS/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWS(int id)
        {
            var WS = await _context.WS.FindAsync(id);
            if (WS == null)
            {
                return NotFound();
            }

            _context.WS.Remove(WS);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WSExists(int id)
        {
            return _context.WS.Any(e => e.Id == id);
        }
    }
}
