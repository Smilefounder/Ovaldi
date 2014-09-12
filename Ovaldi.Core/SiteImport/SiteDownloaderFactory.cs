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
            //为了避免检查是否存在已有的downloader，和IsCompleted状态发送变化的影响，锁放在最外面。
            lock (siteDownloaders)
            {
                if (siteDownloaders.ContainsKey(sessionId))
                {
                    var downloader = siteDownloaders[sessionId];
                    if (downloader.IsCompleted == true)
                    {
                        siteDownloaders.Remove(sessionId);
                    }
                    else
                    {
                        throw new Exception("一个Session只能有一个下载任务");
                    }
                }

                if (!siteDownloaders.ContainsKey(sessionId))
                {
                    var downloader = EngineContext.Current.Resolve<ISiteDownloader>(new Parameter("options", options));
                    siteDownloaders[sessionId] = downloader;
                }
            }
            return siteDownloaders[sessionId];
        }

        public static ISiteDownloader GetSiteDownloader(string sessionId)
        {
            if (siteDownloaders.ContainsKey(sessionId))
            {
                return siteDownloaders[sessionId];
            }
            return null;
        }
    }
}
