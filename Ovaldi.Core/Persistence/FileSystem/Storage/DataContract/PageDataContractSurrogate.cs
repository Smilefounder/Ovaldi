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
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage.DataContract
{
    public class PageDataContractSurrogate : SiteObjectDataContractSurrogate
    {
        public override Type GetDataContractType(Type type)
        {
            if (true)
            {
                
            }
            return GetDataContractType(type);
        }

        public override object GetDeserializedObject(object obj, Type targetType)
        {
            return GetDeserializedObject(obj, targetType);
        }

        public override object GetObjectToSerialize(object obj, Type targetType)
        {
            return GetObjectToSerialize(obj, targetType);
        }
    }
}
