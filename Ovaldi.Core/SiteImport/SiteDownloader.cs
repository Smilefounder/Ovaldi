#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(ISiteDownloader))]
    public class SiteDownloader : ISiteDownloader
    {
        ISiteProvider _siteProvider;
        IPageDownloader _pageDownloader;
        public SiteDownloader(ISiteProvider siteProvider, IPageDownloader pageDownloader)
        {
            _siteProvider = siteProvider;
            _pageDownloader = pageDownloader;
        }
        public IEnumerable<PageLevel> Download(DownloadOptions options)
        {
            var site = CreateSite(options.SiteName);

            var siteDownloadContext = new SiteDownloadContext(site, options);

            siteDownloadContext.DownloadQueue.Enqueue(new PageLevel(options.Url, 0));

            while (siteDownloadContext.DownloadQueue.Count > 0)
            {
                var page = siteDownloadContext.DownloadQueue.Dequeue();
                _pageDownloader.Download(page, siteDownloadContext);
            }
            return siteDownloadContext.DownloadedList;
        }

        private Site CreateSite(string siteName)
        {
            var site = new Site(siteName);

            _siteProvider.Add(site);

            return site;
        }
    }
}
