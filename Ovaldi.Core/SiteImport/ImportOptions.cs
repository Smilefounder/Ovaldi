using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Ovaldi.Core.SiteImport
{
    public class ImportOptions
    {
        public ImportOptions()
        {
            this.Deep = 2;
            this.Pages = 20;
        }
        
        public string SiteName { get; set; }
        
        public string Url { get; set; }
        
       
        public int Deep { get; set; }
        
       
        public int Pages { get; set; }
    }
}