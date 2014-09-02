using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class Style
    {
        public Style(string url)
        {
        }
        public string Url { get; private set; }
        public string Content { get; private set; }
        public List<Image> Images { get; private set; }

        public void Download()
        {

        }
    }
}