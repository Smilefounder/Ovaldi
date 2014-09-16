#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    public interface ISiteDownloader
    {
        string SessionId { get; }
        DownloadOptions Options { get; }

        bool IsCompleted { get; }

        IList<PageLevel> DownloadedPages { get; }
        Queue<PageLevel> DownloadQueue { get; }

        event EventHandler<PageDownloadedEventArgs> PageDownloaded;
        event EventHandler<DownloadCompletedEventArgs> DownloadCompleted;

        IEnumerable<PageLevel> Download();
    }
}
