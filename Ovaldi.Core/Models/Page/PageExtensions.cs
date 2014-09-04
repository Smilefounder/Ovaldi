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
using Kooboo.Common.Web;
namespace Ovaldi.Core.Models
{
    public static class PageExtensions
    {
        public static Page GetParent(this Page page)
        {
            var parentAbsoluteName = FullNameHelper.GetParentAbsoluteName(page.AbsoluteName);
            if (!string.IsNullOrEmpty(parentAbsoluteName))
            {
                return new Page(page.Site, parentAbsoluteName);
            }
            return null;
        }

        public static string[] GetVirtualPaths(this Page page)
        {
            if (page.Routes == null || page.Routes.Length == 0)
            {
                return new[] { GetVirtualPath(page, null) };
            }
            return page.Routes.Select(it => GetVirtualPath(page, it)).ToArray();
        }
        public static string GetVirtualPath(this Page page, PageRoute route)
        {
            var segment = page.Name;
            string virtualPath = "";
            var parent = page.GetParent();
            var site = page.Site;
            if (route != null && !string.IsNullOrEmpty(route.Identifier))
            {
                if ((route.Identifier.StartsWith("#") || route.Identifier == "*") && parent != null)
                {
                    return parent.LastVersion(site).GetVirtualPaths().First();
                }
                else if (route.Identifier.StartsWith("/"))
                {
                    return route.Identifier;
                }
                else
                {
                    if (route != null && !string.IsNullOrEmpty(route.Identifier) && !route.Identifier.StartsWith("/"))
                    {
                        segment = route.Identifier;
                    }
                }
            }
            if (parent != null)
            {
                virtualPath = UrlUtility.Combine(parent.LastVersion(site).GetVirtualPaths().First(), segment);
            }
            else
            {
                virtualPath = segment;
            }
            if (!virtualPath.StartsWith("/"))
            {
                virtualPath = "/" + virtualPath;
            }
            return virtualPath;
        }
        public static string GetLinkText(this Page page)
        {
            //if (page.Navigation != null && !string.IsNullOrEmpty(page.Navigation.DisplayText))
            //{
            //    return page.Navigation.DisplayText;
            //}
            return page.Name;
        }

    }
}
