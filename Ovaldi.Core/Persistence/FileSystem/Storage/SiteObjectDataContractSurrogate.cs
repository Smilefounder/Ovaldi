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
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem.Storage
{
    public class SiteObjectDataContractSurrogate : IDataContractSurrogate
    {
        public object GetCustomDataToExport(Type clrType, Type dataContractType)
        {
            return null;
        }

        public object GetCustomDataToExport(System.Reflection.MemberInfo memberInfo, Type dataContractType)
        {
            return null;
        }
        public Type GetReferencedTypeOnImport(string typeName, string typeNamespace, object customData)
        {
            return null;
        }

        public System.CodeDom.CodeTypeDeclaration ProcessImportedType(System.CodeDom.CodeTypeDeclaration typeDeclaration, System.CodeDom.CodeCompileUnit compileUnit)
        {
            return null;
        }
        public void GetKnownCustomDataTypes(System.Collections.ObjectModel.Collection<Type> customDataTypes)
        {

        }

        public Type GetDataContractType(Type type)
        {
            return type == typeof(Site) ? typeof(SitePropertySerialization) : type;
        }

        public object GetDeserializedObject(object obj, Type targetType)
        {
            if (obj is SitePropertySerialization)
            {
                return new Site(((SitePropertySerialization)obj).SiteAbsoluteName);
            }
            return obj;
        }


        public object GetObjectToSerialize(object obj, Type targetType)
        {
            if (obj is Site)
            {
                return new SitePropertySerialization() { SiteAbsoluteName = ((Site)obj).AbsoluteName };
            }
            return obj;
        }


    }
}
