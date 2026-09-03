!macro customInit
  # 优先级：1. 注册表已有安装路径（initMultiUser 已设置）
  #         2. /D= 命令行参数（initMultiUser 已处理）
  #         3. D:\chaoxing-gui（本宏设置的新默认）

  # 检查 $INSTDIR 是否已由 initMultiUser 设置为有效路径
  # 如果已有旧安装或指定了 /D=，则不覆盖
  ReadRegStr $R1 HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation
  ${If} $R1 != ""
    # 用户已有安装，保留 initMultiUser 设置的路径
    Goto customInitDone
  ${EndIf}

  ReadRegStr $R1 HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation
  ${If} $R1 != ""
    # 全局安装已存在，保留路径
    Goto customInitDone
  ${EndIf}

  !insertmacro GetDParameter $R1
  ${If} $R1 != ""
    # 用户通过 /D= 指定了路径，保留
    Goto customInitDone
  ${EndIf}

  # 到这里说明：无旧安装 + 无 /D= 参数，应用新默认
  # 检查 D: 盘是否存在
  ${If} ${FileExists} "D:\*.*"
    StrCpy $INSTDIR "D:\chaoxing-gui"
  ${Else}
    # D: 盘不存在，退回 LocalAppData 默认（已由 initMultiUser 设置）
  ${EndIf}

customInitDone:
!macroend
