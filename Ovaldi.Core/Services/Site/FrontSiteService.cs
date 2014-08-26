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
using Ovaldi.Core.SiteFlow;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Services
{
    [Dependency(typeof(IFrontSiteService))]
    public class FrontSiteService : IFrontSiteService
    {
        public SiteMappedContext MapSite(System.Web.HttpRequest httpRequest)
        {
            return new SiteMappedContext() { Site = new Site("SampleSite"), MatchedBinding = new Binding() { Domain = "localhost" }, RequestChannel = FrontRequestChannel.Host };
        }
    }
}
