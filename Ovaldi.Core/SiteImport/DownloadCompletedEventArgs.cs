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
    public class DownloadCompletedEventArgs : EventArgs
    {
        public DownloadCompletedEventArgs(IList<PageLevel> downloadedPages)
        {
            this.DownloadedPages = downloadedPages;
        }
        public IList<PageLevel> DownloadedPages { get; private set; }
    }
}
