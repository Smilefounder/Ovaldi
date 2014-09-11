#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    public static class SiteDownloaderFactory
    {
        private volatile static Dictionary<string, ISiteDownloader> siteDownloaders = new Dictionary<string, ISiteDownloader>();
        public static ISiteDownloader CreateSiteDownloader(string sessionId, DownloadOptions options)
        {
            var downloader = EngineContext.Current.Resolve<ISiteDownloader>(new Parameter("options", options));
            return downloader;
        }

        public static ISiteDownloader GetSiteDownloader(string sessionId)
        {
            if (siteDownloaders.ContainsKey(sessionId))
            {
                return siteDownloaders[sessionId];
            }
            return null;
        }
        public static void SetSiteDownloader(string sessionId, ISiteDownloader siteDownloader)
        {
            if (!siteDownloaders.ContainsKey(sessionId))
            {
                lock (siteDownloaders)
                {
                    if (!siteDownloaders.ContainsKey(sessionId))
                    {
                        siteDownloaders[sessionId] = siteDownloader;
                    }
                }
            }
        }
    }
}
