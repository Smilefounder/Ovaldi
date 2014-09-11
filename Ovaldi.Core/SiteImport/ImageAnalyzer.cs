#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Kooboo.Common.Web;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IPageAnalyzer), Key = "ImageAnalyzer")]
    public class ImageAnalyzer : IPageAnalyzer
    {
        IHttpClient _httpClient;
        ISiteFileProvider _siteFileProvider;
        public ImageAnalyzer(IHttpClient httpClient, ISiteFileProvider siteFileProvider)
        {
            this._httpClient = httpClient;
            this._siteFileProvider = siteFileProvider;
        }
        public void Analyze(PageDownloadContext context)
        {
            var images = context.HtmlDocument.DocumentNode.Descendants()
               .Where(lnks => lnks.Name == "img" &&
                            lnks.Attributes["src"] != null &&
                            !string.IsNullOrEmpty(lnks.Attributes["src"].Value));

            foreach (var link in images)
            {
                var url = UriHelper.GetInsideAbsoluteUrl(context.PageLevel.Url, link.Attributes["src"].Value);
                if (!string.IsNullOrEmpty(url))
                {
                    var newUrl = DownloadImage(context, url);
                    link.Attributes["src"].Value = newUrl;
                }
            }
        }
        private string DownloadImage(PageDownloadContext pageDownloadContext, string imageUrl)
        {
            var absolutePath = new Uri(imageUrl).AbsolutePath;
            var filePath = Path.Combine("Images", absolutePath.Trim('/'));
            if (!_siteFileProvider.IsFileExists(pageDownloadContext.SiteDownloadContext.Site, filePath))
            {
                var data = _httpClient.DownloadData(imageUrl);
                if (data!=null)
                {
                    _siteFileProvider.AddFile(pageDownloadContext.SiteDownloadContext.Site, filePath, data);
                }

            }

            return UrlUtility.Combine("/", SiteExtensions.PREFIX_FRONT_PREVIEW_URL + pageDownloadContext.SiteDownloadContext.Site.AbsoluteName, filePath);
        }
    }
}
