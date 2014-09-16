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
        string _sessionId;
        ISiteProvider _siteProvider;
        IPageDownloader _pageDownloader;
        DownloadOptions _options;
        IList<PageLevel> _downloadedPages = new List<PageLevel>();
        Queue<PageLevel> _downloadQueue = new Queue<PageLevel>();
        public bool IsCompleted { get; private set; }

        public string SessionId
        {
            get
            {
                return _sessionId;
            }
        }
        public IList<PageLevel> DownloadedPages
        {
            get { return _downloadedPages; }
        }

        public Queue<PageLevel> DownloadQueue
        {
            get { return _downloadQueue; }
        }

        public DownloadOptions Options { get { return _options; } }

        public SiteDownloader(string sessionId, ISiteProvider siteProvider, IPageDownloader pageDownloader, DownloadOptions options)
        {
            _sessionId = sessionId;
            _siteProvider = siteProvider;
            _pageDownloader = pageDownloader;
            _options = options;
        }
        public IEnumerable<PageLevel> Download()
        {
            var site = CreateSite(_options.SiteName);

            var siteDownloadContext = new SiteDownloadContext(site, _options, _downloadedPages, _downloadQueue);

            siteDownloadContext.DownloadQueue.Enqueue(new PageLevel(_options.Url, 0));

            while (siteDownloadContext.DownloadQueue.Count > 0)
            {
                var page = siteDownloadContext.DownloadQueue.Dequeue();

                _pageDownloader.Download(page, siteDownloadContext);

                OnPageDownloaded(new PageDownloadedEventArgs(page));
            }

            IsCompleted = true;
            OnDownLoadCompleted(new DownloadCompletedEventArgs(DownloadedPages));
            return siteDownloadContext.DownloadedPages;
        }

        private Site CreateSite(string siteName)
        {
            var site = new Site(siteName);

            _siteProvider.Add(site);

            return site;
        }

        #region .ctor
        public event EventHandler<PageDownloadedEventArgs> PageDownloaded;

        public event EventHandler<DownloadCompletedEventArgs> DownloadCompleted;

        protected virtual void OnPageDownloaded(PageDownloadedEventArgs args)
        {
            if (PageDownloaded != null)
            {
                PageDownloaded(this, args);
            }
        }
        protected virtual void OnDownLoadCompleted(DownloadCompletedEventArgs args)
        {
            if (DownloadCompleted != null)
            {
                DownloadCompleted(this, args);
            }
        }
        #endregion
    }
}
