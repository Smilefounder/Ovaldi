using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class HttpData
    {
        public HttpData(string contentType, byte[] data, string text, Encoding encoding)
        {
            this.ContentType = contentType;
            this.Data = data;
            this.Text = text;
            this.Encoding = encoding;
        }
        public string ContentType { get; private set; }
        public string Text { get; private set; }

        public byte[] Data { get; private set; }

        public Encoding Encoding { get; private set; }
    }
}