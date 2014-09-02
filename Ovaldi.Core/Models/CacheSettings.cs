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

namespace Ovaldi.Core.Models
{
    public class CacheSettings
    {
        private bool? _enable;
        public bool? EnableCache
        {
            get
            {
                if (!_enable.HasValue)
                {
                    _enable = false;
                }
                return _enable;
            }
            set
            {
                _enable = value;
            }
        }

        public ExpirationPolicy ExpirationPolicy { get; set; }
        /// <summary>
        /// The time, in seconds, that the page or view is cached. 
        /// </summary>
        public int Duration { get; set; }       
    }

}
