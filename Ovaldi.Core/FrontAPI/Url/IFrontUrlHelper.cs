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
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ovaldi.Core.FrontAPI
{
    public interface IFrontUrlHelper
    {
        UrlHelper Url { get; }
        Site Site { get; }
        FrontRequestChannel RequestChannel { get; }
        IHtmlString WrapperUrl(string url);
        IHtmlString WrapperUrl(string url, bool? requireSSL);

        IHtmlString GeneratePageUrl(string urlKey, object values, Func<Site, string, Page> findPage, out Page page);

        IHtmlString GeneratePageUrl(Page page, object values);
    }
}
