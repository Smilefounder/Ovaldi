﻿#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Routing;

namespace Ovaldi.Core
{
    internal static class RouteValuesHelper
    {
        public static RouteValueDictionary GetRouteValues(object routeValues)
        {
            if (routeValues == null)
            {
                return new RouteValueDictionary();
            }
            //for nvelocity statement: "%{UserKey = $item.UserKey}"
            if (routeValues is IDictionary)
            {
                var routeValueDic = new RouteValueDictionary();
                var dic = ((IDictionary)routeValues);
                foreach (var key in dic.Keys)
                {
                    routeValueDic[key.ToString()] = dic[key];
                }
                return routeValueDic;
            }
            if (routeValues is IDictionary<string, object>)
            {
                return new RouteValueDictionary((IDictionary<string, object>)routeValues);
            }

            return new RouteValueDictionary(routeValues);
        }


        public static RouteValueDictionary MergeRouteValues(RouteValueDictionary implicitRouteValues, RouteValueDictionary routeValues)
        {
            RouteValueDictionary dictionary = new RouteValueDictionary(implicitRouteValues);

            if (routeValues != null)
            {
                foreach (KeyValuePair<string, object> pair in routeValues)
                {
                    dictionary[pair.Key] = pair.Value;
                }
            }

            return dictionary;
        }
    }
}
