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
    public class SiteMappedContext
    {
        public SiteMappedContext(Site site, Binding matchedBinding, FrontRequestChannel requestChannel, string requestUrl, string appRelativeCurrentExecutionFilePath)
        {
            this.Site = site;
            this.RequestChannel = requestChannel;
            this.MatchedBinding = matchedBinding;
            this.RequestUrl = requestUrl;
            this.AppRelativeCurrentExecutionFilePath = appRelativeCurrentExecutionFilePath;
        }
        public Site Site { get; private set; }
        public FrontRequestChannel RequestChannel { get; private set; }
        public Binding MatchedBinding { get; private set; }

        public string RequestUrl { get; private set; }
        public string AppRelativeCurrentExecutionFilePath { get; set; }


    }
}
