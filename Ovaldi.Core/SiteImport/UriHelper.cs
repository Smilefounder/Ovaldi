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
    internal class UriHelper
    {
        /// <summary>
        /// 转换成站点的绝对URL
        /// 如果是外链，返回null
        /// </summary>
        /// <param name="baseUrl"></param>
        /// <param name="url"></param>
        /// <returns></returns>
        public static string GetInsideAbsoluteUrl(string baseUrl, string url)
        {
            var baseUri = new Uri(baseUrl);
            if (!string.IsNullOrEmpty(url))
            {
                if (Uri.IsWellFormedUriString(url, UriKind.Relative))
                {
                    var absoluteUrl = new Uri(baseUri, url);
                    return absoluteUrl.ToString();
                }
                else if (Uri.IsWellFormedUriString(url, UriKind.Absolute))
                {
                    var uri = new Uri(url);
                    if (uri.Host == baseUri.Host)
                    {
                        return uri.ToString();
                    }
                }
            }
            return null;
        }
    }
}
