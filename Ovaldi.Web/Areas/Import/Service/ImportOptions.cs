using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class ImportOptions
    {
        public ImportOptions()
        {
            this.Deep = 2;
            this.Pages = 20;
        }
        [Required]
        public string SiteName { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        [DefaultValue(2)]
        public int Deep { get; set; }
        [Required]
        [DefaultValue(20)]
        public int Pages { get; set; }
    }
}