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

namespace Ovaldi.Core.SiteFlow
{
    public class PageMappedContext
    {
        public PageMappedContext(Page page, PageRoute matchedRoute, string matchedVirtualPath, string queryStringPath)
        {
            this.Page = page;
            this.MatchedRoute = matchedRoute;
            this.MatchedVirtualPath = matchedVirtualPath;
            this.QueryStringPath = queryStringPath;
        }
        public Page Page { get; private set; }
        public PageRoute MatchedRoute { get; private set; }
        /// <summary>
        /// 用于标识页面的哪段URL Path
        /// 比如：pagename1/pagename2/value1/value2 中的 pagename1/pagename2
        /// </summary>
        public string MatchedVirtualPath { get; private set; }
        /// <summary>
        /// 用于传参的那段URL Path
        /// 比如：pagename1/pagename2/value1/value2 中的 value1/value2
        /// </summary>
        public string QueryStringPath { get; private set; }
    }
}
