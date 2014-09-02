using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class Image
    {
        public Image(string url)
        {
            this.Url = url;
        }
        public string Url { get; private set; }
        public void Download()
        { 
        }
    }
}