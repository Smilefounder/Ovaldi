using Kooboo.Common.ComponentModel;
using Ovaldi.Core.SiteImport;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Models
{
    [MetadataFor(typeof(DownloadOptions))]
    public class DownloadOptions_Metadata
    {
        [Required]
        public string SiteName { get; set; }
        [Required]
        public string Url { get; set; }


        public int Deep { get; set; }


        public int Pages { get; set; }
    }
}