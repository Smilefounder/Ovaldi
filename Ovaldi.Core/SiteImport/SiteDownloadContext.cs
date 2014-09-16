#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    public class SiteDownloadContext
    {
        public SiteDownloadContext(Site site, DownloadOptions options, IList<PageLevel> downloadedPages, Queue<PageLevel> downloadQueue)
        {
            this.Site = site;
            this.Options = options;
            this.DownloadedPages = downloadedPages ?? new List<PageLevel>();
            this.DownloadQueue = downloadQueue ?? new Queue<PageLevel>();
        }
        public Site Site { get; private set; }
        public DownloadOptions Options { get; private set; }

        public IList<PageLevel> DownloadedPages { get; private set; }

        public Queue<PageLevel> DownloadQueue { get; private set; }

    }
}
