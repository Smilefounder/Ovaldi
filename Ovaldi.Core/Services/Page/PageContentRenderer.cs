#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.FrontAPI;
using Ovaldi.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Ovaldi.Core.Services
{
    public interface PageContentRenderer<T>
       where T : PageContent
    {
        IHtmlString Render(IFrontHtmlHelper htmlHelper, T pagePosition);
    }
}
